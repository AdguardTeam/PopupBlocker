export const migrationStorageV1V2 = {
    init: {
        '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
        ver: '1',
        'test.com': {
            whitelisted: true,
        },
        whitelist: 'example.com,domain.org',
    },
    expected: {
        '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
        ver: '2',
        whitelist: 'test.com,example.com,domain.org',
    },
};

export const migrationStorageV2V3 = {
    init: {
        '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
        ver: '2',
        whitelist: 'test.com,example.com,domain.org',
        'silenced.domain.org': '1',
        'silenced.domain2.org': '1',
        'unsilenced.domain2.org': '0',
    },
    expected: {
        '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
        ver: '3',
        allowed: 'test.com,example.com,domain.org',
        silenced: 'silenced.domain.org,silenced.domain2.org',
    },
};

export const migrationStorageV1V3 = {
    init: migrationStorageV1V2.init,
    expected: {
        '#id': 'eOyryuWbTWPoeyiD4zXxmt/JJKSVLOS9',
        ver: '3',
        allowed: 'test.com,example.com,domain.org',
        silenced: '',
    },
};
