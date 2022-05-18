import { FuseNavigation } from '@fuse/types';

export const adminNavigation: FuseNavigation[] = [
    {
        id: 'eke',
        title: 'EKE',
        translate: 'NAV.EKE',
        type: 'group',
        icon: 'apps',
        children: [
            {
                id: 'home',
                title: 'Home',
                translate: 'NAV.HOME',
                type: 'item',
                icon: 'dashboard',
                url: '/apps/home'
            },
            {
                id: 'articles',
                title: 'Articles',
                translate: 'NAV.ARTICLES',
                type: 'item',
                icon: 'account_box',
                url: '/apps/licenta/articles'
            },
            {
                id: 'comments',
                title: 'Comments',
                translate: 'NAV.COMMENTS',
                type: 'item',
                icon: 'account_box',
                url: '/apps/licenta/comments'
            },
            {
                id: 'advertisements',
                title: 'Ads',
                translate: 'NAV.ADS',
                type: 'item',
                icon: 'account_box',
                url: '/apps/licenta/advertisements'
            }
        ]
    },
];
