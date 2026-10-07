import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from './config';
import { Role } from '@/lib/types/ecommerce';

// 1. Convert Firebase Auth error codes into friendly user messages
export function getFriendlyErrorMessage(errorCode: string, lang: 'bn' | 'en' = 'bn'): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return lang === 'bn' ? 'এই ইমেইল দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট খোলা রয়েছে।' : 'This email is already registered.';
    case 'auth/invalid-email':
      return lang === 'bn' ? 'অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন।' : 'Invalid email address format.';
    case 'auth/weak-password':
      return lang === 'bn' ? 'পাসওয়ার্ড অত্যন্ত দুর্বল! কমপক্ষে ৬ বা ৮ ডিজিটের পাসওয়ার্ড দিন।' : 'Password is too weak. Must be at least 6 characters.';
    case 'auth/user-not-found':
      return lang === 'bn' ? 'এই ইমেইলে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।' : 'No account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return lang === 'bn' ? 'ভুল পাসওয়ার্ড অথবা ইমেইল! আবার চেষ্টা করুন।' : 'Incorrect password or invalid email credentials.';
    case 'auth/too-many-requests':
      return lang === 'bn' ? 'অতিরিক্ত ভুল চেষ্টার কারণে অ্যাকাউন্ট সাময়িক লক হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।' : 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return lang === 'bn' ? 'লগইন পপআপ উইন্ডো বন্ধ করা হয়েছে।' : 'Login popup was closed before completing.';
    case 'auth/network-request-failed':
      return lang === 'bn' ? 'ইন্টারনেট সংযোগে সমস্যা! আপনার ইন্টারনেট কানেকশন চেক করুন।' : 'Network connection failed. Please check your internet.';
    case 'auth/operation-not-allowed':
      return lang === 'bn' ? 'এই লগইন মেথডটি ফায়ারবেসে সক্রিয় করা হয়নি।' : 'This login method is not enabled.';
    case 'auth/invalid-phone-number':
      return lang === 'bn' ? 'অনুগ্রহ করে সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: +88017xxxxxxxx)।' : 'Invalid phone number format. Please provide international format.';
    case 'auth/missing-phone-number':
      return lang === 'bn' ? 'মোবাইল নম্বর প্রদান করুন।' : 'Phone number is required.';
    case 'auth/quota-exceeded':
      return lang === 'bn' ? 'এসএমএস কোটা শেষ হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।' : 'SMS quota exceeded. Please try again later.';
    case 'auth/captcha-check-failed':
      return lang === 'bn' ? 'reCAPTCHA যাচাইকরণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'reCAPTCHA verification failed. Please try again.';
    case 'auth/invalid-verification-code':
      return lang === 'bn' ? 'ভুল ওটিপি (OTP) কোড! সঠিক ৬ ডিজিটের কোড দিন।' : 'Invalid OTP verification code.';
    case 'auth/code-expired':
      return lang === 'bn' ? 'ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে। নতুন কোড পাঠান।' : 'OTP code has expired. Please request a new one.';
    default:
      return lang === 'bn' ? 'একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'An unexpected error occurred. Please try again.';
  }
}

// 2. Automatically save and sync user profile to Firestore 'users' collection
export async function saveUserProfileToFirestore(user: FirebaseUser, additionalData: {
  name?: string;
  phone?: string;
  role?: Role;
  shopName?: string;
  shopAddress?: string;
  customerId?: string;
  sellerIdNumber?: string;
} = {}) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const isSeller = additionalData.role === 'SELLER';
    const fallbackId = isSeller
      ? `QA-SL-${Math.floor(10000000 + Math.random() * 90000000)}`
      : `QA-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const userProfile = {
      id: user.uid,
      uid: user.uid,
      customerId: additionalData.customerId || fallbackId,
      sellerIdNumber: isSeller ? (additionalData.sellerIdNumber || fallbackId) : undefined,
      name: additionalData.name || user.displayName || 'Customer',
      email: user.email ? user.email.toLowerCase() : '',
      phone: additionalData.phone || user.phoneNumber || '',
      role: additionalData.role || 'CUSTOMER',
      status: 'Active',
      avatarUrl: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      ordersCount: 0,
      totalSpent: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...additionalData
    };

    await setDoc(userRef, userProfile, { merge: true });
    return { success: true, profile: userProfile };
  } catch (error: any) {
    console.warn('Firestore Profile Save Notice:', error);
    return {
      success: true,
      profile: {
        id: user.uid,
        uid: user.uid,
        name: additionalData.name || user.displayName || 'Customer',
        email: user.email || '',
        phone: additionalData.phone || '',
        role: additionalData.role || 'CUSTOMER',
        status: 'Active',
        customerId: additionalData.customerId || `QA-${Math.floor(10000000 + Math.random() * 90000000)}`
      }
    };
  }
}

// 3. Robust Sign-Up Handler
export async function handleFirebaseSignUp({
  email,
  password,
  name,
  phone,
  role = 'CUSTOMER',
  lang = 'bn'
}: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: Role;
  lang?: 'bn' | 'en';
}) {
  try {
    if (!email.trim() || !password || !name.trim()) {
      return {
        success: false,
        error: lang === 'bn' ? 'সবগুলো প্রয়োজনীয় ঘর পূরণ করুন' : 'Please fill all required fields'
      };
    }

    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    const user = userCredential.user;

    try {
      await updateProfile(user, { displayName: name.trim() });
    } catch {
      // Non-blocking
    }

    const { profile } = await saveUserProfileToFirestore(user, {
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      role
    });

    return { success: true, user, profile };
  } catch (error: any) {
    console.error('Sign-Up Error:', error);
    const userMessage = error.code ? getFriendlyErrorMessage(error.code, lang) : (error.message || 'Registration failed');
    return { success: false, error: userMessage, rawError: error };
  }
}

// 4. Robust Login Handler
export async function handleFirebaseLogin({
  email,
  password,
  lang = 'bn'
}: {
  email: string;
  password: string;
  lang?: 'bn' | 'en';
}) {
  try {
    if (!email.trim() || !password) {
      return {
        success: false,
        error: lang === 'bn' ? 'ইমেইল ও পাসওয়ার্ড প্রদান করুন' : 'Please enter email and password'
      };
    }

    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    const user = userCredential.user;

    let profile: any = null;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        profile = userDocSnap.data();
      } else {
        const res = await saveUserProfileToFirestore(user);
        profile = res.profile;
      }
    } catch {
      profile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: 'CUSTOMER'
      };
    }

    return { success: true, user, profile };
  } catch (error: any) {
    console.error('Login Error:', error);
    const userMessage = error.code ? getFriendlyErrorMessage(error.code, lang) : (error.message || 'Login failed');
    return { success: false, error: userMessage, rawError: error };
  }
}

// 5. Robust Google Sign-In Handler
export async function handleFirebaseGoogleLogin(lang: 'bn' | 'en' = 'bn') {
  try {
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    let profile: any = null;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        const res = await saveUserProfileToFirestore(user, {
          name: user.displayName || 'Google User',
          email: user.email || '',
          phone: user.phoneNumber || '',
          role: 'CUSTOMER'
        });
        profile = res.profile;
      } else {
        profile = docSnap.data();
      }
    } catch {
      profile = {
        id: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        role: 'CUSTOMER'
      };
    }

    return { success: true, user, profile };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    const userMessage = error.code ? getFriendlyErrorMessage(error.code, lang) : (error.message || 'Google login failed');
    return { success: false, error: userMessage };
  }
}

// 6. Recaptcha Verifier Initialization for Phone Auth
export function initPhoneRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifier | null {
  if (typeof window === 'undefined' || !auth) return null;
  try {
    // Clear any existing instance on window if present
    const existingVerifier = (window as any).recaptchaVerifier;
    if (existingVerifier) {
      try {
        existingVerifier.clear();
      } catch (e) {
        // ignore
      }
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired, user needs to retry.');
      }
    });

    (window as any).recaptchaVerifier = verifier;
    return verifier;
  } catch (error) {
    console.error('RecaptchaVerifier init error:', error);
    return null;
  }
}

// 7. Send Phone OTP with signInWithPhoneNumber
export async function handleFirebasePhoneAuthSend({
  phoneNumber,
  appVerifier,
  lang = 'bn'
}: {
  phoneNumber: string;
  appVerifier: RecaptchaVerifier;
  lang?: 'bn' | 'en';
}) {
  try {
    if (!phoneNumber.trim()) {
      return {
        success: false,
        error: lang === 'bn' ? 'মোবাইল নম্বর লিখুন' : 'Please enter a phone number'
      };
    }

    // Format BD or generic international phone number
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith('01') && formattedPhone.length === 11) {
      formattedPhone = `+880${formattedPhone.slice(1)}`;
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+880${formattedPhone}`;
    }

    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    return { success: true, confirmationResult, formattedPhone };
  } catch (error: any) {
    console.error('Phone Auth Send OTP Error:', error);
    const userMessage = error.code ? getFriendlyErrorMessage(error.code, lang) : (error.message || 'Failed to send OTP code');
    return { success: false, error: userMessage, rawError: error };
  }
}

// 8. Verify OTP Code and save user profile to Firestore
export async function handleFirebasePhoneAuthVerify({
  confirmationResult,
  otpCode,
  name,
  role = 'CUSTOMER',
  lang = 'bn'
}: {
  confirmationResult: ConfirmationResult;
  otpCode: string;
  name?: string;
  role?: Role;
  lang?: 'bn' | 'en';
}) {
  try {
    if (!otpCode || otpCode.trim().length < 6) {
      return {
        success: false,
        error: lang === 'bn' ? 'সঠিক ৬ ডিজিটের ওটিপি (OTP) কোড দিন' : 'Please enter valid 6-digit OTP code'
      };
    }

    const userCredential = await confirmationResult.confirm(otpCode.trim());
    const user = userCredential.user;

    if (name && name.trim()) {
      try {
        await updateProfile(user, { displayName: name.trim() });
      } catch {
        // Non-blocking
      }
    }

    let profile: any = null;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        const res = await saveUserProfileToFirestore(user, {
          name: name?.trim() || user.displayName || `User ${user.phoneNumber?.slice(-4)}`,
          phone: user.phoneNumber || '',
          role
        });
        profile = res.profile;
      } else {
        profile = docSnap.data();
      }
    } catch {
      profile = {
        id: user.uid,
        name: name?.trim() || `User ${user.phoneNumber?.slice(-4)}`,
        phone: user.phoneNumber || '',
        role: 'CUSTOMER'
      };
    }

    return { success: true, user, profile };
  } catch (error: any) {
    console.error('Phone Auth Verify Error:', error);
    const userMessage = error.code ? getFriendlyErrorMessage(error.code, lang) : (error.message || 'Invalid or expired OTP code');
    return { success: false, error: userMessage, rawError: error };
  }
}

