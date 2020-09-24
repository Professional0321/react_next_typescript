import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useTracksQuery } from '../generated/graphql';
import ReactPlayer from 'react-player'
import Link from 'next/link';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Index = () => {
  const [{ data }] = useTracksQuery();
  return (
    <div>
      Hell-O World
      <br />
      {!data ? (
        <Spin indicator={loadingIcon} />
      ) : (
          data.tracks.map((track) => (
            <div key={track.id}>
              <ReactPlayer
                url={track.url}
                width="200px"
                height="150px"
              />
              <Link href="#">
                <strong>{track.name}</strong>
              </Link>
            </div>))
        )}
    </div>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
