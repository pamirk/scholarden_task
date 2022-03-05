import type { NextPage } from 'next';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    SimpleGrid,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue as mode,
    useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { ErrorMsg } from '../components/Auth/AuthComponents';
import { apiPost } from '../hooks/api';
import { AuthType, useAuth } from '../context/AuthContext';
import { redirectUser } from '../utils/auth';
import { parseCookies } from 'nookies';

const Login: NextPage = () => {
    const { isLoggedIn, login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmmitting] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const { isOpen, onToggle } = useDisclosure();
    const passRef = React.useRef<HTMLInputElement>(null);

    const onClickReveal = () => {
        onToggle();
        if (passRef.current) {
            passRef.current.focus({ preventScroll: true });
        }
    };
    const handleLogin = () => {
        setIsSubmmitting(true);
        apiPost<AuthType>(`/api/auth/login`, {
            username,
            password,
        })
            .then((res) => {
                if (res.error || !res.token) {
                    setError(res.message);
                } else {
                    login(res.token);
                }
            })
            .catch((ex) => setError(ex.message))
            .finally(() => setIsSubmmitting(false));
    };

    if (isLoggedIn) {
        router.push('/');
    }

    return (
        <Box minH="100vh" bg={{ md: mode('gray.800', 'inherit') }}>
            <Box
                maxW="6xl"
                mx="auto"
                py={{ base: '10', md: '0' }}
                px={{ base: '4', md: '10' }}
            >
                <SimpleGrid columns={{ base: 1, lg: 1 }} spacing="14">
                    <Box bg={{ md: mode('gray.800', 'inherit') }}>
                        <Container
                            maxW="lg"
                            py={{ base: '12', md: '24' }}
                            px={{ base: '0', sm: '8' }}
                        >
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleLogin();
                                }}
                            >
                                <Stack spacing="8">
                                    <Box
                                        py={{ base: '0', sm: '8' }}
                                        px={{ base: '4', sm: '10' }}
                                        bg={mode(
                                            'gray.700',
                                            useBreakpointValue({
                                                base: 'inherit',
                                                sm: 'gray.700',
                                            })
                                        )}
                                        boxShadow={{ base: 'none', sm: 'md' }}
                                        borderRadius={{
                                            base: 'none',
                                            sm: 'xl',
                                        }}
                                    >
                                        <HStack
                                            height={70}
                                            width={70}
                                            m="auto"
                                            justify="center"
                                        >
                                            Currency Exchange Rates
                                        </HStack>
                                        <Box
                                            mb="8"
                                            textAlign={{
                                                base: 'center',
                                                md: 'center',
                                            }}
                                        >
                                            <Heading
                                                color={'white'}
                                                size="lg"
                                                mb="2"
                                                fontWeight="extrabold"
                                            >
                                                Welcome Back
                                            </Heading>
                                            <HStack
                                                spacing="1"
                                                justify="center"
                                            >
                                                <Text color={'white'}>
                                                    Don&apos;t have an account?
                                                </Text>
                                                <Link href={'/signup'} passHref>
                                                    <Button
                                                        color={mode(
                                                            '#04BFBF',
                                                            '#90CDF4'
                                                        )}
                                                        colorScheme={'#04BFBF'}
                                                        variant="link"
                                                    >
                                                        Sign up
                                                    </Button>
                                                </Link>
                                            </HStack>
                                        </Box>
                                        <Stack spacing="6">
                                            <Stack spacing="5">
                                                <FormControl>
                                                    <FormLabel
                                                        color={'gray.100'}
                                                        htmlFor="username"
                                                    >
                                                        User Name
                                                    </FormLabel>
                                                    <Input
                                                        value={username}
                                                        onChange={(e) =>
                                                            setUsername(
                                                                e.target.value
                                                            )
                                                        }
                                                        color={'white'}
                                                        id="username"
                                                        required
                                                    />
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel
                                                        color={'gray.100'}
                                                        htmlFor="password"
                                                    >
                                                        Password &#183;{' '}
                                                        <Button
                                                            color={mode(
                                                                '#04BFBF',
                                                                'blue.200'
                                                            )}
                                                            colorScheme={
                                                                '#04BFBF'
                                                            }
                                                            variant="link"
                                                        >
                                                            Forgot?
                                                        </Button>
                                                    </FormLabel>
                                                    <InputGroup>
                                                        <Input
                                                            color={'white'}
                                                            id="password"
                                                            ref={passRef}
                                                            value={password}
                                                            onChange={(e) =>
                                                                setPassword(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            name="password"
                                                            type={
                                                                isOpen
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            autoComplete="current-password"
                                                            required
                                                        />
                                                        <InputRightElement>
                                                            <IconButton
                                                                variant="link"
                                                                aria-label={
                                                                    isOpen
                                                                        ? 'Mask password'
                                                                        : 'Reveal password'
                                                                }
                                                                icon={
                                                                    isOpen ? (
                                                                        <HiEyeOff />
                                                                    ) : (
                                                                        <HiEye />
                                                                    )
                                                                }
                                                                onClick={
                                                                    onClickReveal
                                                                }
                                                            />
                                                        </InputRightElement>
                                                    </InputGroup>
                                                </FormControl>
                                            </Stack>

                                            {error !== '' && (
                                                <ErrorMsg>{error}</ErrorMsg>
                                            )}
                                            <Stack spacing="6">
                                                <Button
                                                    isLoading={isSubmitting}
                                                    fontFamily={
                                                        'Londrina Solid'
                                                    }
                                                    bg={'#04BFBF'}
                                                    type="submit"
                                                    colorScheme={'#04BFBF'}
                                                    size="lg"
                                                    fontSize="md"
                                                >
                                                    Sign in
                                                </Button>
                                            </Stack>
                                            <HStack>
                                                <FormControl>
                                                    <FormLabel
                                                        color={'gray.100'}
                                                        htmlFor="password"
                                                    >
                                                        <Button
                                                            onClick={() =>
                                                                router.push('/')
                                                            }
                                                            color={mode(
                                                                '#04BFBF',
                                                                'blue.200'
                                                            )}
                                                            colorScheme={
                                                                '#04BFBF'
                                                            }
                                                            variant="link"
                                                        >
                                                            Go Back
                                                        </Button>
                                                    </FormLabel>
                                                </FormControl>
                                            </HStack>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </form>
                        </Container>
                    </Box>
                </SimpleGrid>
            </Box>
        </Box>
    );
};
Login.getInitialProps = async (ctx) => {
    const { token } = parseCookies(ctx);
    if (token) redirectUser(ctx, '/');
    return { token };
};
export default Login;
