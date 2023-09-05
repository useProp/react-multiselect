import Select, { SelectOption } from './components/Select.tsx';
import { useState } from 'react';

const options: SelectOption[] = [
  { label: 'first', value: 1, },
  { label: 'second', value: 2, },
  { label: 'third', value: 3, },
  { label: 'fourth', value: 4, },
  { label: 'fifth', value: 5, },
];

function App() {
  const [value, setValue] = useState<SelectOption[] | []>([options[0]])
  const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);

  return (
    <>
      <Select
        multiple
        options={options}
        value={value}
        onChange={(o: SelectOption[] | []) => setValue(o)}
      />

      <br/>

      <Select
        options={options}
        value={value2}
        onChange={(o: SelectOption | undefined) => setValue2(o)}
      />
    </>
  )
}

export default App
