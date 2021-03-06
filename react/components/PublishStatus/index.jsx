import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import * as publishStates from 'constants/publish_claim_states';

function PublishStatus ({ status, message }) {
  return (
    <div className="row row--tall flex-container--column flex-container--center-center">
      {(status === publishStates.LOAD_START) &&
        <div className="row align-content-center">
          <p>File is loading to server</p>
          <p className="blue">{message}</p>
        </div>
      }
      {(status === publishStates.LOADING) &&
      <div>
        <div className="row align-content-center">
          <p>File is loading to server</p>
          <p className="blue">{message}</p>
        </div>
      </div>
      }
      {(status === publishStates.PUBLISHING) &&
      <div className="row align-content-center">
        <p>Upload complete.  Your file is now being published on the blockchain...</p>
        <ProgressBar size={12}/>
        <p>Curious what magic is happening here? <a className="link--primary" target="blank" href="https://lbry.io/faq/what-is-lbry">Learn more.</a></p>
      </div>
      }
      {(status === publishStates.SUCCESS) &&
      <div className="row align-content-center">
        <p>Your publish is complete! You are being redirected to it now.</p>
        <p>If you are not automatically redirected, <a class="link--primary" target="_blank" href={message}>click here.</a></p>
      </div>
      }
      {(status === publishStates.FAILED) &&
      <div className="row align-content-center">
        <p>Something went wrong...</p>
        <p><strong>{message}</strong></p>
        <p>For help, post the above error text in the #speech channel on the <a className="link--primary" href="https://discord.gg/YjYbwhS" target="_blank">lbry discord</a></p>
      </div>
      }
    </div>
  );
};

PublishStatus.propTypes = {
  status : PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default PublishStatus;
