import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { HOME_DISCONNECT_WALLET_BEGIN, HOME_DISCONNECT_WALLET_SUCCESS, HOME_DISCONNECT_WALLET_FAILURE } from './constants';

export function disconnectWallet() {
  return dispatch => {
    dispatch({ type: HOME_DISCONNECT_WALLET_BEGIN });

    const promise = new Promise(async (resolve, reject) => {
      try {
        const { web3, web3Modal } = useSelector(state => ({
          web3: state.home.web3,
          web3Modal: state.home.web3Modal
        }));
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
          await web3.currentProvider.close();
        }
        await web3Modal.clearCachedProvider();
        dispatch({ type: HOME_DISCONNECT_WALLET_SUCCESS });
        resolve()
      } catch (error) {
        dispatch({ type: HOME_DISCONNECT_WALLET_FAILURE })
        reject(error.message || error)
      }
    });
    return promise;
  };
}

export function useDisconnectWallet() {
  const dispatch = useDispatch();
  const disconnectWalletPending = useSelector(state => (state.home.disconnectWalletPending), shallowEqual);
  const boundAction = useCallback(() => dispatch(disconnectWallet()), [dispatch]);

  return { disconnectWalletPending, disconnectWallet: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_DISCONNECT_WALLET_BEGIN:
      return {
        ...state,
        disconnectWalletPending: true
      };

    case HOME_DISCONNECT_WALLET_SUCCESS:
      return {
        ...state,
        web3: null,
        address: "",
        disconnectWalletPending: false
      };
    case HOME_DISCONNECT_WALLET_FAILURE:
      return {
        ...state,
        web3: null,
        address: "",
        disconnectWalletPending: false
      };

    default:
      return state;
  }
}