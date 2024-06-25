// import { useEffect } from 'react';

// export const useSpotifyPlayer = (token) => {
//   useEffect(() => {
//     window.onSpotifyWebPlaybackSDKReady = () => {
//       const player = new Spotify.Player({
//         name: 'Web Playback SDK Quick Start Player',
//         getOAuthToken: cb => { cb(token); }
//       });

//       // プレイヤーのセットアップ
//       player.addListener('ready', ({ device_id }) => {
//         console.log('Ready with Device ID', device_id);
//       });

//       player.addListener('not_ready', ({ device_id }) => {
//         console.log('Device ID has gone offline', device_id);
//       });

//       player.connect();
//     };
//   }, [token]);
// };
