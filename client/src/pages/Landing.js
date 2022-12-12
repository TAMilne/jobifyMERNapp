import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/Testing'
import {Logo} from '../components'

const Landing = () => {
  return <Wrapper>
            <nav>
                <Logo/>
            </nav>
            <div className='container page'>
                <div className='info'>
                    <h1>Job <span>Tracking</span> app
                    </h1>
                    <p>
                    I'm baby locavore jean shorts cray photo booth squid ethical. Hella narwhal affogato, mustache succulents woke messenger bag viral jianbing stumptown gastropub. 8-bit brunch mlkshk, meggings truffaut fam affogato. Normcore flexitarian occupy 3 wolf moon kogi lo-fi craft beer mumblecore pickled iceland portland tote bag vinyl. Echo park meh cold-pressed, VHS fingerstache hot chicken tofu health goth post-ironic.
                    </p>
                    <button className='btn btn-hero'>Login/Register</button>
                </div>
                <img src={main} alt="job hunt" className="img main-img" />
            </div>
        </Wrapper>
}

export default Landing