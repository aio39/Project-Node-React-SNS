import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

import axios from 'axios';
import wrapper from '../store/configureStore';
import backUrl from '../config/axios_config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

const App = ({ Component }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <title>App</title>
    </Head>
    <Component />
  </>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App);
