const root = document.getElementsByTagName('html')[0];
if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
  root.classList.add('is-mac');
}
if (/(iPhone|iPod|iPad)/i.test(navigator.platform)) {
  root.classList.add('is-ios');
}
