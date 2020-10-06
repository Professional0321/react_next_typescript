import { LinkOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { useTrackQuery, useUpdateTrackMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';
import '../../../styles/components/editTrack.less';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { Title } = Typography;

type EditTrackProps = {
    name: string;
    url: string;
};

const EditTrack = () => {
    const router = useRouter();
    const intId = useGetIntId();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const [{ data, fetching }] = useTrackQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    });
    const [, updateTrack] = useUpdateTrackMutation();
    // const [errors, setErrors] = useState<Array>([]);

    const onFinish = async (values: EditTrackProps) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        const { error } = await updateTrack({
            id: intId,
            ...values,
        });

        if (!error) {
            setLoading(false);
            router.back();
        }
    };

    if (fetching) {
        return <Spin indicator={loadingIcon} />;
    }

    if (!data?.track) {
        return <div>Musique introuvable.</div>;
    }

    return (
        <>
            <Title style={{ textAlign: 'center', color: '#f3f5f9' }}>Modifier une musique</Title>
            <Form
                name="create_track"
                className="edit-track-form"
                layout="vertical"
                initialValues={{
                    name: data.track.name,
                    url: data.track.url,
                }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    label="Nom - Titre (Remix)"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez entrer le nom et titre de la musique séparé par un " - " (Remix). !',
                        },
                    ]}
                >
                    <Input placeholder="Nom - Titre de la musique (Remix)" />
                </Form.Item>
                <Form.Item
                    name="url"
                    label="Lien"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez entre un lien Youtube vers la musique !',
                        },
                    ]}
                >
                    <Input
                        prefix={<LinkOutlined className="site-form-item-icon" />}
                        type="text"
                        placeholder="Lien de la musique (YouTube/Soundcloud)"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="edit-track-form-button" loading={loading}>
                        Modifier la musique
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(EditTrack);
