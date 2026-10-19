import React, { useRef, useState, useEffect } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import Form, { ButtonItem, SimpleItem } from 'devextreme-react/form';
import { db } from '@/lib/firebase';
import { DataGrid, Column } from 'devextreme-react/data-grid';

const SecurityDataForm = () => {
  const [rows, setRows] = useState([]);
  // const [korean, setKorean] = useState('');
  // const [mongolian, setMongolian] = useState('');
  const [formData, setFormData] = useState({
    video_id: '',
  })
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // const nextId = useRef(1);
  const koreanRef = useRef(null);

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      video_id: '',
    }));
    setEditingId(null);
  };

  // 추가 / 수정
  const onSubmit = async () => {
    // event.preventDefault();

    const values = {
      video_id: formData.video_id.trim().normalize('NFC'),
    };

    if (!values.video_id) {
      setMessage('비디오 ID를 입력해 주세요.');
      return;
    }

    const docRef = await addDoc(collection(db, 'security_videos'), {
      video_id: values.video_id,
    });
    setRows((prev) => [...prev, { id: docRef.id, ...values }]);

    // if (editingId !== null) {
    //   setRows((prev) =>
    //     prev.map((row) =>
    //       row.id === editingId ? { ...row, ...values } : row
    //     )
    //   );

    //   setMessage('수정되었습니다.');
    // } else {
    //   const id = nextId.current++;

    //   setRows((prev) => [...prev, { id, ...values }]);
    //   setMessage('추가되었습니다.');
    // }

    resetForm();
    koreanRef.current?.focus();
  };

  // 수정할 항목을 입력란에 표시
  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormData((prev) => ({
      ...prev,
      video_id: row.video_id,
    }));
    setMessage('선택한 항목을 수정 중입니다.');
    koreanRef.current?.focus();
  };

  // 삭제
  const handleDelete = (row) => {
    if (!window.confirm(`"${row.video_id}" 항목을 삭제할까요?`)) {
      return;
    }

    setRows((prev) => prev.filter((item) => item.id !== row.id));

    if (editingId === row.id) {
      resetForm();
    }

    setMessage('삭제되었습니다.');
  };

  // 한국어 / 몽골어 검색
  const keyword = search.trim().normalize('NFC').toLowerCase();

  const filteredRows = rows.filter((row) => row.video_id.toLowerCase().includes(keyword));

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, 'security_videos'));
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setRows(data);
      } catch (error) {
        console.error('조회 실패:', error.code, error.message);
      }
    })();
  }, []);

  return (
    <div>
      <Form
        formData={formData}
        onSubmit={onSubmit}
        labelLocation='top'
        labelMode='static'
        colCount={2}
      >
        <SimpleItem
          dataField="video_id"
          label={{ text: '아이디' }}
        />
        <ButtonItem
          buttonOptions={{
            text: "저장",
            type: "success",
            onClick: onSubmit,
          }}
        />
      </Form>
      <DataGrid
        dataSource={filteredRows}
        keyExpr="video_id"
      >
        <Column
          dataField="video_id"
          caption="비디오 ID"
        />
      </DataGrid>
    </div>
  );
}

export default SecurityDataForm;
