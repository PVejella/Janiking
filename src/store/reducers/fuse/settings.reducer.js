import * as Actions from '../../actions/fuse/index';
import _ from '@lodash';
import FuseDefaultSettings from '@fuse/FuseDefaultSettings';
import FuseLayouts from '@fuse/components/FuseLayout/FuseLayouts';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const initialState = {
    defaults: _.merge({}, FuseDefaultSettings),
    current : _.merge({}, FuseDefaultSettings)
};

const settings = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SET_SETTINGS:
        {
            return {
                ...state,
                current: _.merge({}, state.current, action.value && action.value.layout && action.value.layout.style ? {layout: {config: FuseLayouts[action.value.layout.style].defaults}} : {}, action.value)
            };
        }
        case Actions.SET_DEFAULT_SETTINGS:
        {
            return {
                ...state,
                defaults: _.merge({}, state.defaults, action.value),
                current : _.merge({}, state.defaults, action.value && action.value.layout && action.value.layout.style ? {layout: {config: FuseLayouts[action.value.layout.style].defaults}} : {}, action.value)
            };
        }
        case Actions.RESET_DEFAULT_SETTINGS:
        {
            return {
                ...state,
                defaults: _.merge({}, state.defaults),
                current : _.merge({}, state.defaults)
            };
        }
        default:
        {
            return state;
        }
    }
};


const persistConfig = {
    key: 'settings',
    storage: storage
};
export default persistReducer(persistConfig, settings);

