import React, { useEffect } from 'react';
import IotaSDK from 'tanglepaysdk-client';
import './App.css';

function App() {
  useEffect(() => {
    console.log('effect called')
    console.log('IotaSDK', IotaSDK);
    IotaSDK._events.on('iota-ready', async () => {
      console.log('iota-ready');
      const res = await IotaSDK.request({
        method: 'iota_connect',
        params: {
            // expires: 3000000
        }
      })
      console.log('res', res);
    });
  }, []);

  return (
    <div className="App">

    </div>
  );
}

export default App;
