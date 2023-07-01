import { ReactNode, useContext } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import WalletMultiButtonDynamic from './WalletMultiButtonDynamic';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Elusiv, SEED_MESSAGE, TopupTxData } from '@elusiv/sdk';
import { AppContext } from '@/contexts/AppProvider';


const Links = ['Dashboard', 'Projects', 'Team'];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    textColor={'gray.200'}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: 'gray.700',
    }}
    href={'#'}
  >
    {children}
  </Link>
);

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { publicKey, signMessage } = useWallet();
  const toast = useToast();
  const { connection } = useConnection();
  const { wallet: { setElusiv, elusiv } } = useContext(AppContext);

  const initElusiv = async () => {
    if (!publicKey || !signMessage) return;
    const encodedMessage = new TextEncoder().encode(SEED_MESSAGE);
    
    try {
      const seed = await signMessage(encodedMessage);
      const elusivInstance = await Elusiv.getElusivInstance(
        seed,
        publicKey,
        connection,
        'devnet'
      );
      setElusiv(elusivInstance);
    } catch (error) {
      toast({
        title: 'Reject use Elusiv Payment',
        description: "You reject to provide seed and key for Elusiv",
        status: 'info',
        duration: 9000,
        isClosable: true,
        position: "top-right"
      })
      return;
    }
  }

  return (
    <>
      <Box bg={'gray.900'} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <div className="mr-2">
              <div className='flex-row flex'>
                {!elusiv && <button 
                  className='elusiv-button mr-4'
                  onClick={initElusiv}
                >
                  Connect to Elusiv
                </button>}

                <WalletMultiButtonDynamic />
              </div>
            </div>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
