import React, { useRef, useState, useEffect } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ForeignLanguageForm = () => {
  const [rows, setRows] = useState([]);
  // const [korean, setKorean] = useState('');
  // const [mongolian, setMongolian] = useState('');
  const [formData, setFormData] = useState({
    work_kr: '',
    work_mn: '',
  })
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // const nextId = useRef(1);
  const koreanRef = useRef(null);

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      work_kr: '',
      work_mn: '',
    }));
    setEditingId(null);
  };

  // 추가 / 수정
  const handleSubmit = async (event) => {
    event.preventDefault();

    const values = {
      work_kr: formData.work_kr.trim().normalize('NFC'),
      work_mn: formData.work_mn.trim().normalize('NFC'),
    };

    if (!values.work_kr || !values.work_mn) {
      setMessage('한국어와 몽골어를 모두 입력해 주세요.');
      return;
    }

    const docRef = await addDoc(collection(db, 'words'), {
      work_kr: values.work_kr,
      work_mn: values.work_mn,
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
      work_kr: row.work_kr,
      work_mn: row.work_mn,
    }));
    setMessage('선택한 항목을 수정 중입니다.');
    koreanRef.current?.focus();
  };

  // 삭제
  const handleDelete = (row) => {
    if (!window.confirm(`"${row.work_kr}" 항목을 삭제할까요?`)) {
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

  const filteredRows = rows.filter(
    (row) =>
      row.work_kr.toLowerCase().includes(keyword) ||
      row.work_mn.toLowerCase().includes(keyword)
  );

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, 'words'));
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
    <main className="page" lang="ko">
      <div className="container">
        <header>
          <h1>한국어 · 몽골어 단어장</h1>
          <p lang="mn">Солонгос · Монгол үгийн сан</p>
        </header>

        <section className="panel" aria-labelledby="form-title">
          <h2 id="form-title">
            {editingId !== null ? '단어 수정' : '새 단어 등록'}
          </h2>

          <form
            onSubmit={handleSubmit}
            onKeyDown={(event) => {
              // 한글 조합 중 Enter로 폼이 제출되는 현상 방지
              if (
                event.key === 'Enter' &&
                (event.nativeEvent.isComposing || event.keyCode === 229)
              ) {
                event.preventDefault();
              }
            }}
          >
            <div className="input-grid">
              <label htmlFor="korean">
                한국어 / Korean
                <input
                  id="korean"
                  ref={koreanRef}
                  lang="ko"
                  value={formData.work_kr}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, work_kr: event.target.value }))
                  }
                  placeholder="예: 안녕하세요"
                  maxLength={500}
                  required
                />
              </label>

              <label htmlFor="mongolian">
                몽골어 / Монгол
                <input
                  id="mongolian"
                  lang="mn"
                  value={formData.work_mn}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, work_mn: event.target.value }))
                  }
                  placeholder="Жишээ: Сайн байна уу"
                  maxLength={500}
                  required
                />
              </label>
            </div>

            <div className="buttons">
              <button type="submit" className="primary">
                {editingId !== null ? '수정 저장' : '추가 / Нэмэх'}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMessage('수정을 취소했습니다.');
                  }}
                >
                  취소
                </button>
              )}
            </div>
          </form>

          <p className="message" role="status">
            {message}
          </p>
        </section>

        <section className="panel" aria-labelledby="list-title">
          <div className="toolbar">
            <h2 id="list-title">
              단어 목록
              <span>
                {filteredRows.length} / {rows.length}
              </span>
            </h2>

            <label htmlFor="search" className="search">
              검색 / Хайх
              <input
                id="search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="한국어 또는 몽골어 검색"
              />
            </label>
          </div>

          <div
            className="table-wrapper"
            role="region"
            aria-label="단어 목록 테이블"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col" className="number">번호</th>
                  <th scope="col">한국어 / Korean</th>
                  <th scope="col">몽골어 / Монгол</th>
                  <th scope="col" className="action-column">관리</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty">
                      {rows.length === 0
                        ? '한국어와 몽골어를 입력하고 추가해 주세요.'
                        : '검색된 자료가 없습니다.'}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={editingId === row.id ? 'editing' : ''}
                    >
                      <td className="number">{index + 1}</td>
                      <td lang="ko">{row.work_kr}</td>
                      <td lang="mn">{row.work_mn}</td>
                      <td>
                        <div className="row-buttons">
                          <button
                            type="button"
                            onClick={() => handleEdit(row)}
                            aria-label={`${row.work_kr} 수정`}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => handleDelete(row)}
                            aria-label={`${row.work_kr} 삭제`}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="note">
          현재 목록은 새로고침하면 초기화됩니다.
        </p>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 40px 20px;
          background: #f5f7fb;
          color: #18253c;
          font-family: Arial, sans-serif;
        }

        .container {
          max-width: 1040px;
          margin: 0 auto;
        }

        header {
          margin-bottom: 28px;
        }

        h1 {
          margin: 0 0 10px;
          font-size: 28px;
        }

        header p,
        .note {
          color: #64748b;
          font-size: 14px;
        }

        .panel {
          padding: 24px;
          margin-bottom: 20px;
          background: white;
          border: 1px solid #e0e6ef;
          border-radius: 14px;
        }

        h2 {
          margin: 0 0 20px;
          font-size: 18px;
        }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        input {
          box-sizing: border-box;
          width: 100%;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          color: #18253c;
          font: inherit;
        }

        input:focus-visible,
        button:focus-visible,
        .table-wrapper:focus-visible {
          outline: 3px solid #93b4ff;
          outline-offset: 2px;
        }

        button {
          padding: 9px 15px;
          border: 1px solid #cbd5e1;
          border-radius: 7px;
          background: white;
          color: #334155;
          font: inherit;
          font-size: 14px;
          cursor: pointer;
        }

        button:hover {
          background: #edf2fa;
        }

        .primary {
          background: #315bce;
          border-color: #315bce;
          color: white;
        }

        .primary:hover {
          background: #2448af;
        }

        .buttons,
        .row-buttons {
          display: flex;
          gap: 8px;
        }

        .buttons {
          margin-top: 18px;
        }

        .message {
          min-height: 20px;
          margin: 12px 0 0;
          color: #315bce;
          font-size: 14px;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .toolbar h2 {
          margin: 0;
        }

        h2 span {
          margin-left: 10px;
          color: #64748b;
          font-size: 13px;
        }

        .search {
          width: 300px;
          max-width: 100%;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 560px;
          border-collapse: collapse;
          table-layout: fixed;
          font-size: 14px;
        }

        th,
        td {
          padding: 15px 12px;
          border-bottom: 1px solid #e5eaf1;
          text-align: left;
          overflow-wrap: anywhere;
        }

        th {
          background: #f5f7fb;
          color: #475569;
        }

        .number {
          width: 44px;
          text-align: center;
          color: #64748b;
        }

        .action-column {
          width: 130px;
        }

        .editing {
          background: #eff5ff;
        }

        .danger {
          color: #b42335;
        }

        .empty {
          padding: 48px 12px;
          text-align: center;
          color: #64748b;
        }

        @media (max-width: 640px) {
          .page {
            padding: 24px 12px;
          }

          .panel {
            padding: 18px;
          }

          h1 {
            font-size: 23px;
          }

          .input-grid {
            grid-template-columns: 1fr;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .search {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

export default ForeignLanguageForm;
