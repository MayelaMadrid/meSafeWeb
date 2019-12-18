
import React from 'react';
import {Home} from "../usuarios/home";
import { shallow ,mount} from 'enzyme';
import renderer from 'react-test-renderer';
import { ReportUser } from '../../components/report';
import Dropzone from '../../components/dropzone';
import Map from '../../components/googleMap/newMap';
import {getReportsTest} from "../reports/actions"
import mockAxios from 'axios';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk] 
const mockStore = configureStore(middlewares)
describe('Home/Report Component', () => {
  let props;
  const store = mockStore({})
  beforeEach(() => {
    props = {
      reports: [
        { id: 1, descripcion: "A chuchita la bolsearon en el mercado" },
        { id: 2, descripcion: "Balacera en 3 rios" },
        { id: 3, descripcion: "Se inundo sector Humaya" },
        { id: 4, descripcion: "Secuestraron un puntero en el sur" }
      ]
    };
  });

  it('Funciona correctamente dispatch y el response es el correcto, ', () => {
    getReportsTest()(store.dispatch).then(response => {
      expect(Array.isArray(response)).toBe(true);
    });
  });

  test('Componente se ejecuta de la misma forma que la anterior', () => {
    const tree = renderer
    .create(<Map  google={window.google}
      center={{lat: 24.7903194, lng: -107.3878174}}
      height='300px'
      zoom={15}></Map>)
    .toJSON();
  expect(tree).toMatchSnapshot();
  });

  test('Verificar que texto y valor del input antes y despues de onChange', () => {
    const dropzone = shallow(
      <Dropzone></Dropzone>);

    expect(dropzone.text()).toEqual('Arrastra las imagenes o da click');
    expect(Array.isArray(dropzone.find('input').props().value)).toBe(false);
    dropzone.find('input').simulate('change');
    expect(Array.isArray(dropzone.find('input').props().value)).toBe(true);
  });

  it("Deberá imprimir un numero de componentes igual al arreglo de reportes", () => {
    const wrapper = shallow(<Home {...props} />);
    expect(wrapper.find('ReportUser').length).toBe(4);
  });
});
