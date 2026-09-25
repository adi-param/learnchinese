export function showAudioHelp({onRetry,onDeviceVoice}={}) {
 document.querySelector('#audio-help')?.remove();
 const dialog=document.createElement('dialog');dialog.id='audio-help';dialog.className='audio-help';
 dialog.setAttribute('aria-labelledby','audio-help-title');
 dialog.innerHTML=`<h2 id="audio-help-title">Let’s get the sound working 🔊</h2>
 <p>The lessons have their own female Mandarin recordings. You normally don’t need to install a voice.</p>
 <ol><li>Turn up your device’s media volume and check that this tab isn’t muted.</li><li>Check your internet connection, then try the recording again.</li><li>If this is an in-app browser, open this website in Safari, Chrome or Edge.</li></ol>
 <p>You can also try a device voice. If no female Mandarin voice is available, use the instructions below.</p>
 <details><summary>iPhone or iPad</summary><ol><li>Open Settings → Accessibility → Read &amp; Speak (called Spoken Content on older versions).</li><li>Open Voices → Chinese and download a Mandarin voice, such as Tingting.</li><li>Wait for the download to finish, then reopen the browser.</li></ol><a href="https://support.apple.com/en-ie/111798" target="_blank" rel="noopener">Apple’s voice setup guide ↗</a></details>
 <details><summary>Mac</summary><ol><li>Open System Settings → Accessibility → Read &amp; Speak (or Spoken Content).</li><li>Open the information button next to System voice. Choose Chinese and download Tingting.</li><li>Wait for the download to finish, then reopen the browser.</li></ol><a href="https://support.apple.com/guide/mac-help/mchlp2290/mac" target="_blank" rel="noopener">Apple’s voice setup guide ↗</a></details>
 <details><summary>Windows</summary><ol><li>Search Settings for Speech. Under Manage voices, choose Add voices.</li><li>Add Chinese (Simplified, China) speech voices and finish the download.</li><li>Reopen your browser and try a female Mandarin voice such as Huihui.</li></ol><a href="https://support.microsoft.com/en-us/accessibility/windows/narrator/appendix-a-supported-languages-and-voices" target="_blank" rel="noopener">Microsoft’s voice setup guide ↗</a></details>
 <details><summary>Android</summary><ol><li>Search Settings for Text-to-speech output (usually under Accessibility).</li><li>Open your speech engine’s settings → Install voice data, and choose Chinese / Mandarin.</li><li>Choose a female voice where offered, then reopen your browser.</li></ol><a href="https://support.google.com/accessibility/android/answer/6006983?hl=en" target="_blank" rel="noopener">Google’s voice setup guide ↗</a></details>
 <p class="meaning">Browser access to installed voices varies. The saved lesson recordings work independently of these settings.</p>
 <p id="voice-help-status" role="status"></p><div class="game-actions"><button class="button" id="audio-retry">Try recording again</button><button class="button secondary" id="device-voice">Try device voice</button><button class="button secondary" id="close-help">Close</button></div>`;
 document.body.append(dialog);
 dialog.querySelector('#close-help').onclick=()=>dialog.close();
 dialog.querySelector('#audio-retry').disabled=!onRetry;
 dialog.querySelector('#audio-retry').onclick=()=>{dialog.close();onRetry();};
 dialog.querySelector('#device-voice').disabled=!onDeviceVoice;
 dialog.querySelector('#device-voice').onclick=()=>onDeviceVoice(dialog.querySelector('#voice-help-status'));
 dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
}
