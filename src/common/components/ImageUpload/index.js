// @flow

/* eslint no-return-assign:0 */
import { Component } from 'react';
import axios from 'axios';
import T from 'i18n-react';

import styles from './styles.less';

import config from 'config';
import ProgressIcon from '../Icon/Progress';
import Message from 'common/components/Message';

const FILE_SIZE_LIMIT = 1000000;
const ALLOWED_FILE_TYPES = ['image/x-png', 'image/jpeg', 'image/png', 'image/jpg'];

type ImageUploadProps = {
  onUploadComplete: Function,
  hintText: Element<any>,
  children?: any,
  disabled?: bool,
  forceShow?: bool,
  uploadName: string,
};

export default class ImageUpload extends Component {
  static defaultProps = {
    onUploadComplete: () => {},
  };

  state = {
    hovering: false,
    uploading: false,
    error: '',
  };

  props: ImageUploadProps;
  fileInput: HTMLInputElement;

  show = () => {
    this.setState({
      hovering: true,
    });
  };

  hide = () => {
    this.setState({
      hovering: false,
    });
  };

  upload = (e: EventHandler) => {
    const [file] = e.target.files;

    if (!file) {
      return;
    }

    if (ALLOWED_FILE_TYPES.indexOf(file.type) === -1) {
      this.setState({
        error: T.translate('images.wrongType'),
      });

      return;
    }

    if (file.size > FILE_SIZE_LIMIT) {
      this.setState({
        error: T.translate('images.tooBig'),
      });

      return;
    }

    this.setState({
      uploading: true,
      error: '',
    });

    const { uploadName } = this.props;

    axios.get(`${config.api.endpoint}sign-upload?contentType=${file.type}&fileName=${uploadName}`)
      .then(({ data: { signedRequest } }) =>
          axios.put(signedRequest, file, {
            headers: {
              Accept: '*/*',
              'Content-Type': file.type,
            },
          })
          .then(() => {
            this.setState({
              uploading: false,
            });

            this.fileInput.value = '';
            this.props.onUploadComplete();
          }, () => {
            this.setState({
              error: 'error :-(',
            });
          }));
  };

  render () {
    if (this.props.disabled) {
      return this.props.children;
    }

    const { hovering, uploading, error } = this.state;

    const showOverlay = this.props.forceShow || hovering || uploading || error;
    const overlayContent = (error && <Message type="error">{error}</Message>) ||
      (uploading && <ProgressIcon />) ||
      <span className={styles.hintText}>{this.props.hintText}</span>;

    return (
      <div
        onMouseLeave={this.hide}
        onMouseEnter={this.show}
        className={styles.root}
      >
        {showOverlay && (
          <div className={styles.uploadOverlay}>
            {overlayContent}
          </div>
        )}

        {uploading || <input
          accept="image/x-png,image/jpeg"
          className={styles.fileUpload}
          onChange={this.upload}
          ref={(ref) => this.fileInput = ref}
          type="file"
        />}

        {this.props.children}
      </div>
    );
  }
}
