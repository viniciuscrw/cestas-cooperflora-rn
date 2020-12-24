import React from 'react';
import HeaderTitle from './HeaderTitle';
import GLOBALS from '../Globals';

const MainHeader = () => {
  return (
    <HeaderTitle
      title={GLOBALS.APP.NAME}
      subtitle={GLOBALS.CONSUMER_GROUP.NAME}
    />
  );
};

export default MainHeader;
