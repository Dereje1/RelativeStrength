// dumb component to dispaly footer
import React from 'react';
import './styles/footer.scss';

const Footer = () => (
  <React.Fragment>
    <hr />
    <div id="author">
      <span className="copyright">Dereje Getahun {'\u00A9'} 2018</span>
      <div className="gitsource"><a href="https://github.com/Dereje1/RelativeStrength" target="_blank" rel="noopener noreferrer"> <i className="fa fa-github" aria-hidden="true" /> Github</a></div>
    </div>
  </React.Fragment>
);

export default Footer;
