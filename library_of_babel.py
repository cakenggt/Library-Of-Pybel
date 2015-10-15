import math
import string
import random
import sys

length_of_page = 3239
loc_mult = pow(30, length_of_page)
title_mult = pow(30, 25)

#29 output letters: alphabet plus comma, space, and period
#alphanumeric in hex address (base 36): 3260
#in wall: 4
#in shelf: 5
#in volumes: 32
#pages: 410
#letters per page: 3239
#titles have 25 char

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

def main(input_array):
    if input_array[1] == 'checkout':
        key_str = input_array[2]
        print('\nTitle: '+getTitle(key_str))
        print('\n'+getPage(key_str)+'\n')
    if input_array[1] == 'search':
        search_str = ' '.join(input_array[2:])
        key_str = search(search_str)
        print('\nPage which includes this text:\n'
        +getPage(key_str)+'\n\n@ address '+key_str+'\n')
        only_key_str = search(search_str.ljust(length_of_page))
        print('\nPage which contains only this text:\n'
        +getPage(only_key_str)+'\n\n@ address '+only_key_str+'\n')
        print('\nTitle which contains this text:\n@ address '
        +searchTitle(search_str))
    if input_array[1] == 'test':
        test()

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

def getTitle(address):
    addressArray = address.split(':')
    hex_addr = addressArray[0]
    wall = addressArray[1]
    shelf = addressArray[2]
    volume = addressArray[3].zfill(2)
    loc_int = int(volume+shelf+wall)
    key = int(hex_addr, 36)
    key -= loc_int*title_mult
    str_36 = int2base(key, 36)
    result = toText(int(str_36, 36))
    if len(result) < 25:
        #adding pseudorandom chars
        random.seed(result)
        digs = 'abcdefghijklmnopqrstuvwxyz, .'
        while len(result) < length_of_page:
            result += digs[int(random.random()*len(digs))]
    elif len(result) > 25:
        result = result[-25:]
    return result

def searchTitle(search_str):
    wall = str(int(random.random()*4))
    shelf = str(int(random.random()*5))
    volume = str(int(random.random()*32)).zfill(2)
    #the string made up of all of the location numbers
    loc_str = volume + shelf + wall
    loc_int = int(loc_str) #make integer
    hex_addr = ''
    search_str = search_str[:25].ljust(25)
    hex_addr = int2base(stringToNumber(search_str)+(loc_int*title_mult), 36) #change to base 36 and add loc_int, then make string
    key_str = hex_addr + ':' + wall + ':' + shelf + ':' + volume
    assert search_str == getTitle(key_str)
    return key_str

def getPage(address):
    hex_addr, wall, shelf, volume, page = address.split(':')
    volume = volume.zfill(2)
    page = page.zfill(3)
    loc_int = int(page+volume+shelf+wall)
    key = int(hex_addr, 36)
    key -= loc_int*loc_mult
    str_36 = int2base(key, 36)
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

if __name__ == "__main__":
   main(sys.argv)
