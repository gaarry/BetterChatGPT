import React, { useEffect, useState } from 'react';
import useStore from '@store/store';
import { useTranslation, Trans } from 'react-i18next';

import PopupModal from '@components/PopupModal';
import CrossIcon from '@icon/CrossIcon';

const ApiPopup = () => {
  const { t } = useTranslation(['main', 'api']);

  const apiKey = useStore((state) => state.apiKey);
  const setApiKey = useStore((state) => state.setApiKey);
  const firstVisit = useStore((state) => state.firstVisit);
  const setFirstVisit = useStore((state) => state.setFirstVisit);
  const [inputValue, setInputValue] = useState('');


  const [_apiKey, _setApiKey] = useState<string>(apiKey || '');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    !apiKey && firstVisit
  );
  const [error, setError] = useState<string>('');

  const handleConfirm = () => {
    if (_apiKey.length === 0) {
      setError(t('noApiKeyWarning', { ns: 'api' }) as string);
    } else {
      setError('');
      setApiKey(_apiKey);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    setFirstVisit(false);
  }, []);

  const handleVerification = () => {
    if (inputValue === '姚新宇') {
      getKey();
    } else {
      alert('输入错误, 请联系lil-boat.');
    }
  };

  async function getKey() {
    try {
      // ⛔️ TypeError: Failed to fetch
      // 👇️ incorrect or incomplete URL
      const response = await fetch('https://openaikey.gary-yao.com/');
  
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
  
      const result = await response.text();
      alert('成功获取openai key!');
      _setApiKey(result);

      return result;
    } catch (err) {
      alert('访问失败!');
      console.log(err);
    }
  }  

  return isModalOpen ? (
    <PopupModal
      title='Setup your API key'
      handleConfirm={handleConfirm}
      setIsModalOpen={setIsModalOpen}
      cancelButton={false}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
      <div className='flex gap-2 items-center justify-center mt-2'>
          <label htmlFor="question" className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
          自动获取API！请问作者的全名是姚**？
          </label>
          <input
            type='text'
            className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
            id="question"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="button" className='btn btn-primary justify-center' onClick={handleVerification}>check</button>
        </div>
        <div className='flex gap-2 items-center justify-center mt-2'>
          <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
            {t('apiKey.inputLabel', { ns: 'api' })}
          </div>
          <input
            type='text'
            className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
            value={_apiKey}
            onChange={(e) => {
              _setApiKey(e.target.value);
            }}
          />
        </div>



        {error.length > 0 && (
          <div className='relative py-2 px-3 w-full mt-3 border rounded-md border-red-500 bg-red-500/10'>
            <div className='text-gray-600 dark:text-gray-100 text-sm whitespace-pre-wrap'>
              {error}
            </div>
            <div
              className='text-white absolute top-1 right-1 cursor-pointer'
              onClick={() => {
                setError('');
              }}
            >
              <CrossIcon />
            </div>
          </div>
        )}
      </div>
    </PopupModal>
  ) : (
    <></>
  );
};

export default ApiPopup;
