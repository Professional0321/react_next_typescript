import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Card, Spin, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import { useTracksQuery } from '../generated/graphql';
import '../styles/components/home.less';
import { createUrqlClient } from '../utils/createUrqlClient';

const { Title } = Typography;
// const { Meta } = Card;

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Index = () => {
  const [{ data }] = useTracksQuery({
    variables: {
      limit: 10,
    }
  });
  return (
    <div>
      <Title style={{ color: '#f3f5f9' }}>🔥 Derniers partages</Title>
      <div className="home-track-container">
        {!data ? (
          <Spin indicator={loadingIcon} />
        ) : (
            data.tracks.map((track) => (
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
                <Link href="/hello">
                  <a><strong>{track.name}</strong></a>
                </Link>
                {/* <Meta title={track.name} /> */}
              </Card>))
          )}
      </div>
    </div>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
