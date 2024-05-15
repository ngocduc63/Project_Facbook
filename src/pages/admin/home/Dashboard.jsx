import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import AppCurrentVisits from './app-current-visits';
import AppWebsiteVisits from './app-website-visits';
import AppWidgetSummary from './app-widget-summary';
import useAxiosPrivate from "../../../api/axiosPrivate"
import { useEffect, useState } from 'react';
import Loading from '../../../components/loading/Loading';

function Dashboard() {
    const axiosPrivate = useAxiosPrivate();
    const [dataDoashBoard, setDataDoashBoard] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        axiosPrivate.get('/admin/statistical', { signal })
            .then((response) => {
                setDataDoashBoard(response.data.data)
                setIsLoading(false);
            })
            .catch(() => {
                if (signal.aborted) return
            })

        return () => controller.abort()
    }, [axiosPrivate]);


    return (
        <Container maxWidth="xl">
            {isLoading && <Loading />}
            {!isLoading && dataDoashBoard && <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Tài khoản"
                        total={dataDoashBoard.num_user}
                        color="info"
                        icon={<img alt="icon" src="../../../assets/ic_users.png" />}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Bài viết"
                        total={dataDoashBoard.num_post}
                        color="error"
                        icon={<img alt="icon" src="../../../assets/ic_post.png" />}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Thích"
                        total={dataDoashBoard.num_like}
                        color="warning"
                        icon={<img alt="icon" src="../../../assets/ic_like.png" />}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AppWidgetSummary
                        title="Bình luận"
                        total={dataDoashBoard.num_comment}
                        color="success"
                        icon={<img alt="icon" src="../../../assets/ic_comment.png" />}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <AppWebsiteVisits
                        title="Tổng số tài khoản"
                        subheader={`năm ${dataDoashBoard.current_year}`}
                        chart={{
                            labels: [
                                '01/01/2024',
                                '02/01/2024',
                                '03/01/2024',
                                '04/01/2024',
                                '05/01/2024',
                                '06/01/2024',
                                '07/01/2024',
                                '08/01/2024',
                                '09/01/2024',
                                '10/01/2024',
                                '11/01/2024',
                                '12/01/2024',
                            ],
                            series: [
                                {
                                    name: 'Tổng tài khoản',
                                    type: 'column',
                                    fill: 'solid',
                                    data: dataDoashBoard.list_count_user,
                                },
                            ],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AppCurrentVisits
                        title="Giới tính"
                        chart={{
                            series: [
                                { label: 'Nam', value: dataDoashBoard.num_user_male },
                                { label: 'Nữ', value: dataDoashBoard.num_user_female },
                            ],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <AppWebsiteVisits
                        title="Tổng số bài viết"
                        subheader={`năm ${dataDoashBoard.current_year}`}
                        chart={{
                            labels: [
                                '01/01/2024',
                                '02/01/2024',
                                '03/01/2024',
                                '04/01/2024',
                                '05/01/2024',
                                '06/01/2024',
                                '07/01/2024',
                                '08/01/2024',
                                '09/01/2024',
                                '10/01/2024',
                                '11/01/2024',
                                '12/01/2024',
                            ],
                            series: [
                                {
                                    name: 'Tổng bài viết',
                                    type: 'column',
                                    fill: 'solid',
                                    data: dataDoashBoard.list_count_post,
                                },
                            ],
                        }}
                    />
                </Grid>
            </Grid>}
        </Container>
    );
}

export default Dashboard;