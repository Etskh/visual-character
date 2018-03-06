import NavigationWindow from '../../components/NavigationWindow';

export default class ChangelogView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <NavigationWindow
      title='Changes'>
      <h3>0.0.9 <small>March 2018</small></h3>
      <h4>Features</h4>
      <ul>
        <li>New character button to create new character</li>
        <li>Added hamburger menu to view user info</li>
        <li>Added Changelog with changes</li>
        <li>Can choose from core races</li>
        <li>Can assign stats to new characters</li>
        <li>Added all core classes</li>
        <li>Moved user options to hamburger menu</li>
      </ul>
      <div>build: rc-2102</div>
    </NavigationWindow>;
  }
}
