import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useStore from '@store/store';

import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

import PopupModal from '@components/PopupModal';

import { availableEndpoints, defaultAPIEndpoint } from '@constants/auth';

import DownChevronArrow from '@icon/DownChevronArrow';

const ApiMenu = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation(['main', 'api']);
  const apiKey = useStore((state) => state.apiKey);
  const setApiKey = useStore((state) => state.setApiKey);
  const apiEndpoint = useStore((state) => state.apiEndpoint);
  const setApiEndpoint = useStore((state) => state.setApiEndpoint);

  const [_apiKey, _setApiKey] = useState<string>(apiKey || '');
  const [_apiEndpoint, _setApiEndpoint] = useState<string>(apiEndpoint);
  const [_customEndpoint, _setCustomEndpoint] = useState<boolean>(
    !availableEndpoints.includes(apiEndpoint)
  );
  const [inputValue, setInputValue] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);



  const handleSave = () => {
    setApiKey(_apiKey);
    setApiEndpoint(_apiEndpoint);
    setIsModalOpen(false);
  };

  const handleToggleCustomEndpoint = () => {
    if (_customEndpoint) _setApiEndpoint(defaultAPIEndpoint);
    else _setApiEndpoint('');
    _setCustomEndpoint((prev) => !prev);
  };

  const handleVerification = async () => {
    if (inputValue === answer) {
      getKey();
    } else {
      alert('输入错误, 请联系lil-boat.');
    }
  };

  async function getKey() {
    try {
      // ⛔️ TypeError: Failed to fetch
      // 👇️ incorrect or incomplete URL
      //const response = await fetch('https://worker-sweet-dawn-a239.garyyao18.workers.dev/');
      //const response = await fetch('https://worker-dawn-mud-a161.garyyao18.workers.dev/getKey');
      const response = await fetch('https://openaikey.gary-yao.com/getKey');
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
  
      const result = await response.text();
      alert('acquire openai key successfully.');
      _setApiKey(result);
      setShowQuestion(false);
      return result;
    } catch (err) {
      alert('访问失败!');
      console.log(err);
    }
  }

  async function getQuest() {
    try {
      // ⛔️ TypeError: Failed to fetch
      // 👇️ incorrect or incomplete URL
      //const response = await fetch('https://worker-sweet-dawn-a239.garyyao18.workers.dev/');
      //const response = await fetch('https://worker-dawn-mud-a161.garyyao18.workers.dev/getQuest');
      const response = await fetch('https://openaikey.gary-yao.com/getQuest');
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
  
      const result = await response.json();
      alert('问题获取成功');
      setQuestion(result.question);
      setAnswer(result.answer);
      setShowQuestion(true);

      return result;
    } catch (err) {
      alert('访问失败!');
      console.log(err);
    }
  }

  return (
    <PopupModal
      title={t('api') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
        {/* <label className='flex gap-2 text-gray-900 dark:text-gray-300 text-sm items-center mb-4'>
          <input
            type='checkbox'
            checked={_customEndpoint}
            className='w-4 h-4'
            onChange={handleToggleCustomEndpoint}
          />
          {t('customEndpoint', { ns: 'api' })}
        </label> */}

        <div className='flex gap-2 items-center mb-6'>
          <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
            {t('apiEndpoint.inputLabel', { ns: 'api' })}
          </div>
          {_customEndpoint ? (
            <input
              type='text'
              className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
              value={_apiEndpoint}
              onChange={(e) => {
                _setApiEndpoint(e.target.value);
              }}
            />
          ) : (
            <ApiEndpointSelector
              _apiEndpoint={_apiEndpoint}
              _setApiEndpoint={_setApiEndpoint}
            />
          )}
        </div>
        <div className='flex gap-2 items-center justify-center mt-2'>
          <label htmlFor="question" className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
            自动获取API?
          </label>
          <button type="button" className='btn flex btn-primary' onClick={getQuest}>获取问题</button>
        </div>
        <div className={`flex gap-2 items-center justify-center mt-2 ${showQuestion ? '' : 'hidden'}`}>
          <label htmlFor="question" className='min-w-fit text-gray-900 dark:text-gray-300 text-sm'>
            {question}
          </label>
          <input
            type='text'
            className='text-gray-800 dark:text-white p-3 text-sm border-none bg-gray-200 dark:bg-gray-600 rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
            id="question"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="button" className='btn flex btn-primary' onClick={handleVerification}>check</button>
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
      </div>
    </PopupModal>
  );
};

const ApiEndpointSelector = ({
  _apiEndpoint,
  _setApiEndpoint,
}: {
  _apiEndpoint: string;
  _setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  return (
    <div className='w-[40vw] relative flex-1'>
      <button
        className='btn btn-neutral btn-small flex justify-between w-full'
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
      >
        <span className='truncate'>{_apiEndpoint}</span>
        <DownChevronArrow />
      </button>
      <div
        id='dropdown'
        ref={dropDownRef}
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800 opacity-90 w-32 w-full`}
      >
        <ul
          className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0'
          aria-labelledby='dropdownDefaultButton'
        >
          {availableEndpoints.map((endpoint) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer truncate'
              onClick={() => {
                _setApiEndpoint(endpoint);
                setDropDown(false);
              }}
              key={endpoint}
            >
              {endpoint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApiMenu;
