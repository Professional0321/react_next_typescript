import { LinkOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCreateTrackMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';
import '../styles/components/createTrack.less';
import { cleanYouTubeUrl } from '../utils/cleanYouTubeUrl';

const { Title } = Typography;

type TrackInput = {
    name: string;
    url: string;
};

const CreateTrack = () => {
    const router = useRouter();
    useIsAuth();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    // const [errors, setErrors] = useState<Array>([]);

    const [, createTrack] = useCreateTrackMutation();

    const onFinish = async (values: TrackInput) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        const { error } = await createTrack({
            input: {
                name: values.name,
                url: cleanYouTubeUrl(values.url),
            },
        });

        if (!error) {
            setLoading(false);
            router.push('/');
        }
    };

    return (
        <>
            <Title style={{ textAlign: 'center', color: '#f3f5f9' }}>Ajouter une musique</Title>
            <Form
                name="create_track"
                className="create-track-form"
                layout="vertical"
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
                    rules={[{ required: true, message: 'Veuillez entre un lien vers la musique !' }]}
                >
                    <Input
                        prefix={<LinkOutlined className="site-form-item-icon" />}
                        type="text"
                        placeholder="Lien de la musique (YouTube/SoundCloud)"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="create-track-form-button" loading={loading}>
                        Ajouter la musique
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(CreateTrack);
