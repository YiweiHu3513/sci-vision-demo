import { useState, useRef, useEffect } from 'react';

/**
 * 双击编辑文本组件
 * - 正常：显示文本
 * - 双击：变成 input，自动聚焦全选
 * - 回车 / 失焦：保存
 * - Esc：取消
 */
export default function EditableText({
  value,
  onChange,
  style = {},
  inputStyle = {},
  placeholder = '未命名',
  maxLength = 60,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onChange(trimmed);
    else setDraft(value);
    setEditing(false);
  };

  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={e => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') cancel();
        }}
        maxLength={maxLength}
        style={{
          fontSize: 'inherit', fontWeight: 'inherit', fontFamily: 'inherit',
          color: 'inherit', background: 'var(--bg)',
          border: '1.5px solid var(--sage)', borderRadius: 6,
          padding: '2px 6px', outline: 'none',
          width: '100%', boxSizing: 'border-box',
          ...inputStyle,
        }}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => setEditing(true)}
      title="双击编辑"
      style={{
        cursor: 'text',
        borderBottom: '1px dashed transparent',
        transition: 'border-color .15s',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'var(--text-l)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
    >
      {value || placeholder}
    </span>
  );
}
