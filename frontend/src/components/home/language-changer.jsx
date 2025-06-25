import { Select } from 'antd';

function LanguageChanger() {
  const handleLanguageChange = (e) => {
    console.log(e)
  };

  return (
    <div>
        <Select
            dropdownStyle={{
                background: 'white',
                boxShadow: 'none',
                borderRadius: 0,
            }}
            defaultValue="uz"
            style={{ width: 60 }}
            onChange={handleLanguageChange}
            options={[
                { value: 'uz', label: 'uz' },
                { value: 'en', label: 'en' },
                { value: 'ru', label: 'ru' },
            ]}
        />
    </div>
  );
}

export default LanguageChanger;