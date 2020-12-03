/**
 * Cookie Tools
 */
export function setCookie(cname, cvalue, exSeconds) {
  var d = new Date();
  d.setTime(d.getTime() + (exSeconds * 1000));
  if (d == null) return false;
  document.cookie = cname + "=" + cvalue + "; expires=" + d.toUTCString() + "; path=/;";
}

export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//删除cookie中指定变量函数    
export function delCookie(cname) {
  var myDate = new Date();
  myDate.setTime(0);//设置时间    
  // document.cookie = cname + "=; expires=" + myDate.toUTCString();
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

