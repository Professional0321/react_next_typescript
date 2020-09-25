import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Spin,
  Typography,
} from 'antd';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import ReactPlayer from 'react-player/lazy';
import { useTracksQuery } from '../generated/graphql';
import '../styles/components/home.less';
import { createUrqlClient } from '../utils/createUrqlClient';

const { Title } = Typography;
// const { Meta } = Card;

type trackProps = {
  name: string,
  id: number,
  votes: number,
  url: string,
}

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Index = () => {
  const [{ data, fetching }] = useTracksQuery({
    variables: {
      limit: 8,
    }
  });
  return (
    <div>
      <Title style={{ color: '#f3f5f9' }}>🔥 Derniers partages</Title>
      <div className="home-track-container">
        {fetching && !data ? (
          <Spin indicator={loadingIcon} />
        ) : (
            data!.tracks.map((track: trackProps) => (
              <Card
                key={track.id}
                actions={[
                  <ArrowUpOutlined key="upvote" />,
                  <div>{track.votes}</div>,
                  <ArrowDownOutlined key="downvote" />,
                  <EditOutlined key="edit" />,
                  <DeleteOutlined key="delete" />,
                ]}

              >
                <ReactPlayer
                  url={track.url}
                  width="100%"
                  height="100%"
                  controls
                />
                <Link href="#">
                  <a><strong>{track.name}</strong></a>
                </Link>
                {/* <Meta title={track.name} /> */}
              </Card>))
          )}
      </div>
      {data && (
        <div className="load-more">
          <Button type="primary" loading={fetching}>Voir plus</Button>
        </div>
      )}
    </div>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
