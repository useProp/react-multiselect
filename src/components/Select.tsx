import styles from '../styles/select.module.css';
import { useState, MouseEvent, useEffect, useRef } from 'react';

export type SelectOption = {
  label: string;
  value: string | number;
}

type MultiSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[] | []) => void;
}

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
}

type SelectOptions = {
  options: SelectOption[];
} & (SingleSelectProps | MultiSelectProps);

const Select = ({ multiple, value, options, onChange }: SelectOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighLightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearOptions = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    multiple ? onChange([]) : onChange(undefined);
  }

  const selectOption = (e: MouseEvent<HTMLLIElement | HTMLButtonElement> | null, o: SelectOption) => {
    e?.stopPropagation();
    setIsOpen(false);

    if (multiple) {
      if (value.includes(o)) {
        onChange(value.filter(v => v !== o))
      } else {
        onChange([...value, o]);
      }
    } else {
      value !== o && onChange(o);
    }

  }

  const isOptionSelected = (o: SelectOption) => {
    return multiple ? value.includes(o) : value === o;
  }

  useEffect(() => {
    if (isOpen) {
      setHighLightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) {
        return;
      }

      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen(prev => !prev);
          if (isOpen) {
            selectOption(null, options[highlightedIndex]);
          }
          break;
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newIdx = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
          if (newIdx >= 0 && newIdx < options.length) {
            setHighLightedIndex(newIdx);
          }
          break;
        }
        case 'Escape':
          setIsOpen(false);
          break;
      }
    }
    containerRef.current?.addEventListener('keydown', handler);
    return () => containerRef.current?.removeEventListener('keydown', handler);
  }, [isOpen, highlightedIndex, options]);

  return (
    <>
      <div
        tabIndex={0}
        className={styles.container}
        onClick={() => setIsOpen(prev => !prev)}
        onBlur={() => setIsOpen(false)}
        ref={containerRef}
      >
        <span className={styles.value}>{multiple ? value.map(v => (
          <button
            key={v.value}
            onClick={(e) => selectOption(e, v)}
            className={styles['option-badge']}
          >
            {v.label}
            <span className={styles['remove-btn']}>&times;</span>
          </button>
        )) : value?.label}</span>
        <button
          className={styles['clear-btn']}
          onClick={clearOptions}
        >
          &times;
        </button>
        <div className={styles.divider}></div>
        <div className={styles.caret}></div>
        <ul className={`${styles.options} ${isOpen && styles.show}`}>
          {options.map((o, i) => (
            <li
              key={o.value}
              className={`
              ${styles.option}
              ${isOptionSelected(o) && styles.selected}
              ${highlightedIndex === i && styles.highlighted}
              `}
              onClick={(e) => selectOption(e, o)}
              onMouseEnter={() => setHighLightedIndex(i)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Select;