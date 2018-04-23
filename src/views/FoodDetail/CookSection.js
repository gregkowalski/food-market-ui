import React from 'react'
import { Header, Image } from 'semantic-ui-react'
import './index.css'
import Util from '../../services/Util'
import { CertificationLabels } from '../../Enums'

const CookSection = ({ cook }) => {
    if (!cook)
        return null;

    const join_date = Util.toCurrentTimezoneMoment(cook.join_date);

    return (
        <div>
            <Header className='detail-sub-header' as='h2'>Meet {cook.name}</Header>
            <div className='detail-cook-sub-header'>
                <span style={{ color: '#0fb5c3' }}> Joined in {join_date.format('MMMM YYYY')}</span>
            </div>
            <div style={{ clear: 'both' }}></div>
            <div className='detail-cook-text'>
                {cook.info}
                {cook.certifications && cook.certifications.length > 0 &&
                    <div style={{ marginTop: '15px' }}>
                        Certifications:
                        <div style={{ fontWeight: '400' }}>
                            <ul>
                                {cook.certifications.map((cert, index) => {
                                    return (<li key={index}>{CertificationLabels[cert]}</li>);
                                })}
                            </ul>
                        </div>
                    </div>
                }
            </div>
            <div style={{ marginTop: '25px' }}>
                <Image size='small' circular src={cook.image} />
            </div>
        </div>
    );
}

export default CookSection;