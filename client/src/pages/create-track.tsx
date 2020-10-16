import { LinkOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCreateTrackMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';
import { validateYouTubeUrl } from '../utils/validateYouTubeUrl';
import '../styles/components/createTrack.less';
import { cleanYouTubeUrl } from '../utils/cleanYouTubeUrl';
import { TTrackFormProps } from '../types';

const { Title } = Typography;

const CreateTrack = () => {
    const router = useRouter();
    useIsAuth();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const [, createTrack] = useCreateTrackMutation();

    const onFinish = async (values: TTrackFormProps) => {
        setLoading(true);
        console.log('Received values of form: ', values);
        const { error } = await createTrack({
            input: {
                name: values.name,
                url: cleanYouTubeUrl(values.url),
            },
        });

        if (error) {
            setError(error?.graphQLErrors[0].message);
            setLoading(false);
        }

        const isValidUrl = validateYouTubeUrl(values.url);
        if (!isValidUrl) {
            setLoading(false);
            setError('Url non valide. Seuls les liens YouTube sont acceptés.');
            return;
        }

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
                    label="Artiste(s) - Titre (Remix) [Réf]"
                    rules={[
                        {
                            required: true,
                            message: "Veuillez entrer le nom de l'artiste et le titre de la musique !",
                        },
                    ]}
                >
                    <Input placeholder="Artiste(s) - Titre de la musique (Remix) [Référence]" />
                </Form.Item>
                <Form.Item
                    name="url"
                    label="Lien"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez entre un lien vers la musique !',
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
                    <Button type="primary" htmlType="submit" className="create-track-form-button" loading={loading}>
                        Ajouter la musique
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(CreateTrack);
