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
import { useState } from 'react';

const { Title } = Typography;
const { Meta } = Card;

type trackProps = {
  name: string,
  id: number,
  votes: number,
  url: string,
};

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 8,
    cursor: null as null | string,
  });
  // console.log(variables);

  const [{ data, fetching }] = useTracksQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>Une erreur est survenue dans la requête.</div>;
  }

  return (
    <div>
      <Title style={{ color: '#f3f5f9' }}>🔥 Derniers partages</Title>
      <div className="home-track-container">
        {!data && fetching ? (
          <Spin indicator={loadingIcon} />
        ) : (
            data!.tracks.tracks.map((track: trackProps) => (
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
                {/* <Meta description={`Ajouté par ${track.creator.username}`} /> */}
              </Card>
            ))
          )}
      </div>
      {data && data.tracks.hasMore && (
        <div className="load-more">
          <Button
            type="primary"
            loading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.tracks.tracks[data.tracks.tracks.length - 1].createdAt,
              })
            }}
          >
            Voir plus
              </Button>
        </div>
      )}
    </div>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
