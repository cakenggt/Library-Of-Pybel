import math
import string
import random

length_of_page = 3469


#29 output letters: alphabet plus comma, space, and period
#alphanumeric in hex address (base 36): 3260
#in wall: 4
#in shelf: 5
#in volumes: 32
#pages: 410
#letters per page: 3239

def test():
    assert stringToNumber('a') == 0, stringToNumber('a')
    assert stringToNumber('ba') == 29, stringToNumber('ba')
    assert len(getPage('asaskjkfsdf:2:2:2:33')) == length_of_page, len(getPage('asasrkrtjfsdf:2:2:2:33'))
    assert 'hello kitty' == toText(int(int2base(stringToNumber('hello kitty'), 36), 36))
    assert int2base(4, 36) == '4', int2base(4, 36)
    assert int2base(10, 36) == 'A', int2base(10, 36)
    print 'Tests completed'

def main():
    while True:
        input_str = raw_input('press key\n')
        if input_str.startswith('checkout'):
            key_str = input_str.split(' ')[1]
            print('\n'+getPage(key_str)+'\n')
        if input_str.startswith('search'):
            search_str = ' '.join(input_str.split(' ')[1:])
            wall = str(int(random.random()*4))
            shelf = str(int(random.random()*5))
            volume = str(int(random.random()*32))
            page = str(int(random.random()*410))
            an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            digs = 'abcdefghijklmnopqrstuvwxyz, .'
            hex_addr = ''
            depth = int(random.random()*(length_of_page-len(search_str)))
            front_padding = ''
            for x in xrange(depth):
                front_padding += digs[int(random.random()*len(digs))]
            back_padding = ''
            for x in xrange(length_of_page-(len(front_padding)+len(search_str))):
                back_padding += digs[int(random.random()*len(digs))]
            search_str = front_padding + search_str + back_padding
            number_search = stringToNumber(search_str)
            hex_addr = int2base(number_search, 36)
            #key_str = hex_addr + ':' + wall + ':' + shelf + ':' + volume + ':' + page
            key_str = hex_addr + ':0:0:0:0'
            print('\n'+getPage(key_str)+'\n@'+key_str+'\n')
        if input_str.startswith('quit'):
            return

def getPage(address):
    hex_addr, wall, shelf, volume, page = address.split(':')
    volume = volume.zfill(2)
    page = page.zfill(3)
    key_str = page + volume + shelf + wall + hex_addr
    key = int(key_str, 36)
    str_36 = int2base(key, 36)
    an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    while len(str_36) < 3260:
        mult = pow(29, 3260 - len(str_36))
        key *= mult
        addition = ''
        mult_len = len(int2base(mult, 36))
        for x in xrange(mult_len-1):
            addition += an[int(random.random()*len(an))]
        if addition != '':
            key += int(addition, 36)
        str_36 = int2base(key, 36)
    return toText(int(str_36, 36))[-length_of_page:]

def toText(x):
    digs = 'abcdefghijklmnopqrstuvwxyz, .'
    if x < 0: sign = -1
    elif x == 0: return digs[0]
    else: sign = 1
    x *= sign
    digits = []
    while x:
        digits.append(digs[x % 29])
        x /= 29
    if sign < 0:
        digits.append('-')
    digits.reverse()
    return ''.join(digits)

def stringToNumber(iString):
    digs = 'abcdefghijklmnopqrstuvwxyz, .'
    result = 0
    for x in xrange(len(iString)):
        result += digs.index(iString[len(iString)-x-1])*pow(29,x)
    return result

def int2base(x, base):
    digs = string.digits + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if x < 0: sign = -1
    elif x == 0: return digs[0]
    else: sign = 1
    x *= sign
    digits = []
    while x:
        digits.append(digs[x % base])
        x /= base
    if sign < 0:
        digits.append('-')
    digits.reverse()
    return ''.join(digits)

test()
main()
