import math
import string
import random

length_of_page = 3239
loc_mult = pow(30, length_of_page)

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
    test_string = '.................................................'
    assert test_string in getPage(search(test_string))
    print 'Tests completed'

def main():
    while True:
        input_str = raw_input('press key\n')
        if input_str.startswith('checkout'):
            key_str = input_str.split(' ')[1]
            print('\n'+getPage(key_str)+'\n')
        if input_str.startswith('search'):
            search_str = ' '.join(input_str.split(' ')[1:])
            key_str = search(search_str)
            print('\n'+getPage(key_str)+'\n@'+key_str+'\n')
        if input_str.startswith('test'):
            test()
        if input_str.startswith('quit'):
            return

def search(search_str):
    wall = str(int(random.random()*4))
    shelf = str(int(random.random()*5))
    volume = str(int(random.random()*32)).zfill(2)
    page = str(int(random.random()*410)).zfill(3)
    #the string made up of all of the location numbers
    loc_str = page + volume + shelf + wall
    loc_int = int(loc_str) #make integer
    an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    digs = 'abcdefghijklmnopqrstuvwxyz, .'
    hex_addr = ''
    depth = int(random.random()*(length_of_page-len(search_str)))
    #random padding that goes before the text
    front_padding = ''
    for x in xrange(depth):
        front_padding += digs[int(random.random()*len(digs))]
    #making random padding that goes after the text
    back_padding = ''
    for x in xrange(length_of_page-(depth+len(search_str))):
        back_padding += digs[int(random.random()*len(digs))]
    search_str = front_padding + search_str + back_padding
    hex_addr = int2base(stringToNumber(search_str)+(loc_int*loc_mult), 36) #change to base 36 and add loc_int, then make string
    key_str = hex_addr + ':' + wall + ':' + shelf + ':' + volume + ':' + page
    page_text = getPage(key_str)
    assert page_text == search_str, '\npage text:\n'+page_text+'\nstrings:\n'+search_str
    return key_str

def getPage(address):
    hex_addr, wall, shelf, volume, page = address.split(':')
    volume = volume.zfill(2)
    page = page.zfill(3)
    loc_int = int(page+volume+shelf+wall)
    key = int(hex_addr, 36)
    key -= loc_int*loc_mult
    str_36 = int2base(key, 36)
    an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    result = toText(int(str_36, 36))
    if len(result) < length_of_page:
        #adding pseudorandom chars
        random.seed(result)
        digs = 'abcdefghijklmnopqrstuvwxyz, .'
        while len(result) < length_of_page:
            result += digs[int(random.random()*len(digs))]
    elif len(result) > length_of_page:
        result = result[-length_of_page:]
    return result

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

main()
