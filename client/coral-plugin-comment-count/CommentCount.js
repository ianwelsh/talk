import React from 'react';
import {I18n} from '../coral-framework';
import translations from './translations.json';
const name = 'coral-plugin-comment-count';

const CommentCount = ({count}) => {
  return <div className={`${name}-text`}>
    {`${count} ${count === 1 ? lang.t('comment') : lang.t('comment-plural')}`}
  </div>;
};

export default CommentCount;

const lang = new I18n(translations);
