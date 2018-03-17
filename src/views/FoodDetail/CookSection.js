import React from 'react'
import { Header, Image } from 'semantic-ui-react'
import './index.css'

const CookSection = ({ cook }) => {
    if (!cook)
        return null;

    return (
        <div>
            <Header className='detail-sub-header' as='h2'>Meet {cook.name}</Header>
            <div className='detail-cook-sub-header'>
                {cook.city} · <span style={{ color: '#0fb5c3' }}> Joined in {cook.join_date}</span>
            </div>
            <div style={{ clear: 'both' }}></div>
            <div className='detail-cook-text'>{cook.info}
                <div style={{ marginTop: '15px' }}>
                    Languages:
                <span style={{ fontWeight: '600' }}>{cook.lang}</span>
                </div>
            </div>
            <div style={{ marginTop: '25px' }}>
                <Image size='small' circular src={cook.image} />
            </div>
        </div>
    );
}

export default CookSection;