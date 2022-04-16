import React from 'react'

export const download = data => {
  let content = data.reduce((acc, cur) => {
    if (cur.start === '' && cur.end === '' && cur.text === '')
      return acc
    return acc + cur.start + '\t' + cur.end + '\t' + cur.text + '\r\n'
  }, 'data:text/plain;charset=utf-8,');
  let encodedUri = encodeURI(content);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "anno-text.txt");
  document.body.appendChild(link);
  link.click();
}

export const upload = () => {
  document.getElementById("dataLoader").click()
}

export const loadData = (callBack) => {
  const file = document.getElementById("dataLoader").files[0]
  let reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    let data = reader.result.split("\n").filter(r => r !== '').map(r => {
      r = r.replace('\r', '')
      let col = r.split('\t')
      return {
        start: col[0] ? col[0] : '',
        end: col[1] ? col[1] : '',
        text: col[2] ? col[2] : '',
      }
    })
    callBack(data)
  };
}

export const useWindowSize = () => {
  const [size, setSize] = React.useState([0, 0]);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}