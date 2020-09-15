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
    getStatus: state => state.status,
    getErrorMessage: state => state.errorMessage
  },
  mutations: {
    setStatus(state, payload){
      state.status = payload;
    },
    setError(state, payload){
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
      context.commit('setStatus', 'loading');
      try{
        await db.collection('users').doc("mike").set(payload);
        context.commit('setStatus', 'synced')
      } catch(error){
        context.commit('setError', error.message);
      }
    }),
    updateForm: firestoreAction( async (context, payload: IForm) => {
      context.commit('setStatus', 'loading');
      try{
        await db.collection('users').doc("mike").set(payload);
        context.commit('setStatus', 'synced');
      } catch(error){
        context.commit('setError', error.message);
      }
    }),
    getForm: firestoreAction( async (context) => {
        context.commit('setStatus', 'loading');
        const data = await db.collection('users').doc("mike").get();
        context.commit('setStatus', 'synced');
        return data;
    }),
    deleteForm: firestoreAction( async (context) => {
      context.commit('setStatus', 'loading');
      try{
        await db.collection('users').doc("mike").delete();
        context.commit('setStatus', 'deleted')
      } catch(error){
        context.commit('setError', error.message);
      }
    })
  },
  modules: {}
});
