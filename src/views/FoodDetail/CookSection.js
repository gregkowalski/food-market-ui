import React from 'react'
import { Header, Image } from 'semantic-ui-react'
import './index.css'
import './CookSection.css'
import Util from '../../services/Util'
import Url from '../../services/Url'
import { CertificationLabels } from '../../Enums'

const CookSection = ({ cook }) => {
    if (!cook)
        return null;

    const join_date = Util.toCurrentTimezoneMoment(cook.join_date);

    return (
        <div>
            <Header className='detail-sub-header' as='h2'>Meet {cook.username}</Header>
            <div className='detail-cook-joindate'>
                <span>Joined in {join_date.format('MMMM YYYY')}</span>
            </div>
            <div className='detail-cook-image'>
                <a target='_blank' rel='noopener noreferrer' href={Url.profileView(cook.user_id)}>
                    <Image size='small' circular src={cook.image || '/assets/images/new-food.png'} />
                </a>
            </div>
            <div className='detail-cook-text'>
                {cook.info}
            </div>
            <div className='detail-cook-certs'>
                {cook.certifications && cook.certifications.length > 0 &&
                    <div>
                        Certifications:
                        <ul>
                            {cook.certifications.map((cert, index) => {
                                return (<li key={index}>{CertificationLabels[cert]}</li>);
                            })}
                        </ul>
                    </div>
                }
            </div>

        </div>
    );
}

export default CookSection;