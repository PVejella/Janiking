import {FuseLoadable} from '@fuse';

export const CustomerServicesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/bill-run/dashboard',
            component: FuseLoadable({
                loader: () => import('./customer-services')
            })
        }
    ]
};
