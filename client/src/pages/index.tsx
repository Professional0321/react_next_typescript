import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <div>
      Hell-O World
      <br />
      {!data ? (
      <Spin indicator={loadingIcon} />
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
        )}
    </div>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
