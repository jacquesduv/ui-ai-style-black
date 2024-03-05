const divClasses = {
  'border-bottom': 'solid 2px var(--red-light)',
  'height': '100%',
  'width': '100%',
};

import logo from '../../img/logo.svg'; // Tell webpack this JS file uses this image

function Header({children}) {
  return (
    <div style={divClasses}>
      <img src={logo} alt="None"></img>
      {children}
    </div>
  );
}

export default Header;