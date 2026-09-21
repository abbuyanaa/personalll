'use client';

import React, { useCallback, useState } from 'react';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebase.config';

const FirebaseCRUD = () => {
  const [list, setList] = useState([]);
  const [value, setValue] = useState('');

  const onBtnClick = useCallback(async () => {
    if (value.trim() !== '') {
      const docRef = await addDoc(collection(db, 'items'), { value });
      setList([...list, { id: docRef.id, value }]);
      setValue('');
    }
  }, [value, list]);

  return (
    <div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      <button onClick={onBtnClick}>Add</button>
      <ul>
        {list.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default FirebaseCRUD;
