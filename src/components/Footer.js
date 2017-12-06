import React from 'react';
import {connect} from 'react-redux';
import replaceAll from '../utils/replaceAll';

export const Footer = ({dictionary}) => (
  <footer className="footer">
    <h4 className="footer__message"
      dangerouslySetInnerHTML={{
        __html: replaceAll(dictionary.footerMessage, {
          "{p1}": `<a target="_blank" href="https://github.com/andrewjmead">Andrew Mead</a>`,
          "{p2}": `<a target="_blank" href="https://www.udemy.com/react-2nd-edition/">${dictionary.footerMessageCourse}</a>`,
          "{p3}": `<a target="_blank" href="https://github.com/Jucesr/"> Julio Ojeda</a>`
        })
      }}>
      {/* <span> Original idea by </span>
      <a target="_blank" href="https://github.com/andrewjmead">Andrew Mead</a><span> in it's </span>
      <a target="_blank" href="https://www.udemy.com/react-2nd-edition/">course</a><span>. New features added by </span>
      <a target="_blank" href="https://github.com/Jucesr/"> Julio Ojeda.</a> */}
    </h4>
  </footer>
);

const mapStateToProps = (state) => ({
  locale: state.lang.locale,
  dictionary: state.lang.dictionary
});

export default connect(mapStateToProps)( Footer);
