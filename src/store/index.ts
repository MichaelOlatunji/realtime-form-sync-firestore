import { createStore } from "vuex";
import { db } from '../utils/firebase';
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { IForm } from '../utils/formInterface';

export interface IState {
  status: string;
  errorMessage: string;
  formData: IForm;
}

export default createStore({
  state: {
    status: '',
    errorMessage: '',
    formData: {}
  } as IState,
  getters: {
    get_status: state => state.status
  },
  mutations: {
    set_status(state, payload){
      state.status = payload;
    },
    set_error(state, payload){
      state.status = 'error';
      state.errorMessage = payload;
    },
    ...vuexfireMutations
  },
  actions: {
    bindForm: firestoreAction(({bindFirestoreRef}) => {
      return bindFirestoreRef('users', db.collection('users'))
    }),
    addForm: firestoreAction( async (context, payload) => {
      try{
        await db.collection('users').doc("mike").set(payload);
        context.commit('set_status', 'success')
      } catch(error){
        context.commit('set_error', error.message);
      }
    }),
    updateForm: firestoreAction( async (context, payload: IForm) => {
      try{
        await db.collection('users').doc("mike").set(payload);
        context.commit('set_status', 'synced')
      } catch(error){
        context.commit('set_error', error.message);
      }
    }),
    getForm: firestoreAction( async (context) => {
        return db.collection('users').doc("mike").get();
    }),
    deleteForm: firestoreAction( async (context) => {
      try{
        await db.collection('users').doc("mike").delete();
        context.commit('set_status', 'deleted')
      } catch(error){
        context.commit('set_error', error.message);
      }
    })
  },
  modules: {}
});
