import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store/AppState';

import { applyName } from './Actions';

interface Props {
  applyName: typeof applyName;
  name: string;
}

class General extends React.PureComponent<Props>  {
  public handleApplyName = () => {
    this.props.applyName('my test saga');
  }

  public render() {
    const { name } = this.props;
    return (
      <div>
        General name: {name}
        <button onClick = {this.handleApplyName}>
          Click to apply name
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  name: state.pages.general.name,
});

const mapDispatchToProps = {
  applyName,
};

export default connect(mapStateToProps, mapDispatchToProps)(General);
