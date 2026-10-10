import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useAdminSync<T>(collectionName: string, queryConstraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    
    const q = query(collection(db, collectionName), ...queryConstraints);
    
    // onSnapshot ডাটাবেজের পরিবর্তনের সাথে সাথে রিয়েল-টাইম ডাটা পুশ করে
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      setData(items);
      setLoading(false);
    }, (error) => {
        console.error('Real-time sync error:', error);
        setLoading(false);
    });

    return () => unsubscribe(); // কম্পোনেন্ট আনমাউন্ট হলে লিসেনার বন্ধ হবে
  }, [collectionName]);

  return { data, loading };
}
