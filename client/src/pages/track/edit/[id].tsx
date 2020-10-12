import { LinkOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin, Typography, Space } from 'antd';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { useTrackQuery, useUpdateTrackMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';
import '../../../styles/components/editTrack.less';
import { validateYouTubeUrl } from '../../../utils/validateYouTubeUrl';

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
    
    const [error, setError] = useState<string | undefined>(undefined);

    const onFinish = async (values: EditTrackProps) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        const { error } = await updateTrack({
            id: intId,
            ...values,
        });

        const isValidUrl = validateYouTubeUrl(values.url);
        if (!isValidUrl) {
            setLoading(false);
            setError('Url non valide. Seuls les liens YouTube sont acceptés.');
            return;
        }

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
                    label="Nom - Titre (Remix) [Réf]"
                    rules={[
                        {
                            required: true,
                            message:
                                'Veuillez entrer le nom et titre de la musique séparé par un " - "; suivi du (remix) et de la [référence] si nécessaire !',
                        },
                    ]}
                >
                    <Input placeholder="Nom - Titre de la musique (Remix) [Référence]" />
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
                    {...(error && {
                        validateStatus: 'error',
                        help: error,
                    })}
                >
                    <Input
                        prefix={<LinkOutlined className="site-form-item-icon" />}
                        type="text"
                        placeholder="Lien de la musique (YouTube)"
                    />
                </Form.Item>

                <Form.Item>
                    <Space size="large">
                    <Button
                        type="default"
                        htmlType="button"
                        className="edit-track-form-button"
                        loading={loading}
                        onClick={() => {
                            router.back();
                        }}
                    >
                        Retour
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="edit-track-form-button"
                        loading={loading}
                    >
                        Modifier la musique
                    </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(EditTrack);
